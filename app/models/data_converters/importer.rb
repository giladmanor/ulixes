class Importer
  
  def yml(account)
    @config = YAML.load_file("#{Rails.root}/config/import_config.yml.ignore")
    puts @config
    @account = account
  end
  
  def run
    @config.each{|source|
      puts "Accessing #{source.first}"
      
      source = source[1]
      if source["active"]
        puts "  Processing..."
        res = get_result_set(source["driver"], source["connection"],source["schema"],source["query"])
        process(res,source["field_set"],source["uid"])  
      end
      
    }
  end
  
  
  def get_result_set(driver, conn_data, schema,query)
    conn =  conn_data.inject({}){|memo,(k,v)| memo[k.to_sym] = v.to_s; memo}
    
    client = TinyTds::Client.new(conn) if driver == "sqlserver" 
    client = TinyTds::Client.new(conn) if driver == "oci8" 
    
    unless schema.nil?
      
      r = client.execute("USE #{schema}") 
      puts "  use #{schema} => #{r.fields}" 
      r.do
    end
    client.execute(query)
  end
  
  def process(result_set,conversion_map,uid_field)
    
    result_set.each{|row|
      uid = row[uid_field]
      user = @account.find_user(uid.to_s)
      
      conversion_map.each{|k,v|
        if v=="dim"
          puts "resolve dim #{row[k]}"
          user.resolve_event(row[k].strip,"1")
        elsif v=="val"
          puts "resolve val #{k} #{row[k]}"
          user.resolve_event(k,row[k].to_s.strip)
        end
        
      }
    }
  end
  
  
end

# http://www.andrejkoelewijn.com/blog/2006/01/06/starting-with-ruby-and-oracle/
# http://www.oracle.com/technetwork/articles/marx-ruby-092465.html
# export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_1
# apt-get install libaio1

# DAKA90DB_PROD = " (DESCRIPTION = (LOAD_BALANCE = ON) (FAILOVER = ON) (ADDRESS = (PROTOCOL = TCP)(HOST = 192.115.80.4)(PORT = 1521)) (ADDRESS = (PROTOCOL = TCP)(HOST = 192.115.80.5)(PORT = 1521))     (CONNECT_DATA = (SERVER = DEDICATED) (SERVICE_NAME = daka90) ) )"
# db=DBI.connect("DBI:OCI8:"+DAKA90DB_PROD , 'Daka90_bi_ro', '1q2w3e')
